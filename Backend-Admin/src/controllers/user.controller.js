import { User } from "../models/user.model.js";
import axios from "axios";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { getAllOrders, updateOrderById } from "../services/vendor.service.js";
import { createNotification } from "../services/notification.service.js";

const buildFallbackAssistantReply = (prompt) => {
    const normalizedPrompt = prompt.toLowerCase();

    if (normalizedPrompt.includes("side effect") || normalizedPrompt.includes("reaction")) {
        return [
            "Common medicine side effects can include nausea, dizziness, stomach upset, sleepiness, or headache, but this depends on the specific drug.",
            "Check the label or prescription sheet for the exact medicine name before taking any action.",
            "Get urgent medical help if there is trouble breathing, swelling, fainting, chest pain, or a severe rash.",
            "For dose changes, pregnancy questions, or prescription-specific advice, speak with a doctor or pharmacist.",
        ].join("\n\n");
    }

    if (normalizedPrompt.includes("refill") || normalizedPrompt.includes("prescription")) {
        return [
            "For a prescription refill, keep your medicine name, dosage, and previous prescription details ready.",
            "Many refills still require approval from your doctor or pharmacist, especially for controlled or recently changed medicines.",
            "If you are close to running out, contact the pharmacy early so they can confirm stock and refill eligibility.",
            "If the medicine was stopped or changed recently, do not restart it without professional advice.",
        ].join("\n\n");
    }

    return [
        "The AI provider is temporarily unavailable, so I am replying in fallback mode.",
        `Your question was: "${prompt}"`,
        "Please share the medicine name, symptom, or refill question in one short sentence and I can still give general pharmacy guidance.",
        "For emergencies, severe reactions, pregnancy concerns, or prescription changes, contact a licensed doctor or pharmacist.",
    ].join("\n\n");
};

const isQuotaError = (error) => {
    const status = error.response?.status;
    const providerMessage = error.response?.data?.error?.message || error.message || "";

    return (
        status === 429 ||
        /quota exceeded|rate limit|resource exhausted|too many requests/i.test(providerMessage)
    );
};

const generateAccessAndRefreshToken=async(userId)=>{
    try {
        const user =await User.findById(userId);
        if(!user){
            throw new ApiError(400,"User not found")
        }
        const accessToken=user.generateAccessToken();
        const refreshToken=user.generateRefreshToken();
        user.refreshToken=refreshToken;
        await user.save({validateBeforeSave:false});
        return{accessToken,refreshToken}
        
    } catch (error) {
        console.log("Error:",error.message)
        throw error;
        
    }
}


const registerUser= asyncHandler(async(req,res)=>{
    const {name,email,password,latitude,longitude,role,userName}=req.body
    const normalizedName = name?.trim();
    const normalizedEmail = email?.trim().toLowerCase();
    const normalizedPassword = password?.trim();

    if(
        [normalizedName,normalizedEmail,normalizedPassword].some((field)=>!field)
    ){
        throw new ApiError(400,"All compulsory fields are required")
    }

    const normalizedUserName = userName?.trim() || `${normalizedName.toLowerCase().replace(/\s+/g, "")}-${Date.now()}`;

    const existedUser=await User.findOne({ email: normalizedEmail })
    if(existedUser){
        throw new ApiError(409,"An account with this email already exists")
    }
    const user =await User.create({
        name: normalizedName,
        email: normalizedEmail,
        userName: normalizedUserName,
        latitude,
        longitude,
        role,
        password: normalizedPassword,


    })
    const createdUsername=await User.findById(user._id).select("-password -refreshToken")
    if(!createdUsername){
        throw new ApiError(500,"Something went wrong")
    }

    await createNotification({
        recipientRole: "Admin",
        title: "New user registered",
        message: `${createdUsername.name} created a new customer account.`,
        actorRole: createdUsername.role === "Admin" ? "Admin" : "User",
        actorId: createdUsername._id,
        entityType: "user",
        entityId: String(createdUsername._id),
        metadata: {
            userName: createdUsername.name,
            email: createdUsername.email,
        },
    });

    return res.status(201).json(
        new ApiResponse(201, createdUsername, "User Registered")
    )

})
const loginUser=asyncHandler(async(req,res)=>{
    //get data 
    //password match hash
    //login name exist?
    
    const {password,email}=req.body
    const normalizedEmail = email?.trim().toLowerCase();

    if (!password?.trim() || !normalizedEmail ){
        throw new ApiError(400,"Email and password are required")
    }
    const user= await User.findOne({email: normalizedEmail}).select("+password")
    if(!user){
        throw new ApiError(400,"User not found")

    }
    const isPasswordValid=await user.isPasswordCorrect(password.trim())
    if(!isPasswordValid){
        throw new ApiError(400,"Password incorrect")
    }
    const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id)
    const loggedInUser=await User.findById(user._id).select("-password -refreshToken")
    const option= {
        httpOnly:true,
        secure:process.env.NODE_ENV === "production",

    }
    return res.status(200)
    .cookie("accessToken",accessToken,option)
    .cookie("refreshToken",refreshToken,option)
    
    .json(new ApiResponse(200,
        {user:loggedInUser,accessToken},
        "User logged in"
    ))
    

    
})
const logoutUser=asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        },
        {
            new :true
        }
    )
    const option={
        httpOnly:true,
        secure:process.env.NODE_ENV === "production"
    }
    return res.status(200)
    .clearCookie("accessToken",option)
    .clearCookie("refreshToken",option)
    .json(new ApiResponse(200,{},"User logged out"))
})
const getProfile = asyncHandler(async (req, res) => {
    return res.status(200).json({
        user: req.user
    })
})
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id).select("-password -refreshToken");

    if (!deletedUser) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponse(200, deletedUser, "User deleted successfully")
    );
})

const fetchCustomerOrders = asyncHandler(async (req, res) => {
    const orders = await getAllOrders();
    const safeOrders = Array.isArray(orders) ? orders : [];

    const customerOrders = safeOrders.filter((order) => {
        const sameCustomerId = order.customerId && String(order.customerId) === String(req.user._id);
        const sameCustomerEmail = order.customerEmail && order.customerEmail === req.user.email;
        return sameCustomerId || sameCustomerEmail;
    });

    return res.status(200).json(
        new ApiResponse(200, customerOrders, "Customer orders fetched successfully")
    );
});

const cancelCustomerOrder = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const reason = req.body?.reason?.trim() || "Cancelled by customer";
    const orders = await getAllOrders();
    const safeOrders = Array.isArray(orders) ? orders : [];

    const order = safeOrders.find((entry) => {
        const isSameOrder = String(entry._id) === String(id);
        const sameCustomerId = entry.customerId && String(entry.customerId) === String(req.user._id);
        const sameCustomerEmail = entry.customerEmail && entry.customerEmail === req.user.email;
        return isSameOrder && (sameCustomerId || sameCustomerEmail);
    });

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    if (order.status === "Cancelled") {
        return res.status(200).json(
            new ApiResponse(200, order, "Order is already cancelled")
        );
    }

    if (!["Pending", "Processing"].includes(order.status)) {
        throw new ApiError(400, "Only pending or processing orders can be cancelled");
    }

    const updatedOrder = await updateOrderById(id, {
        status: "Cancelled",
        cancellation: {
            byRole: "User",
            reason,
            cancelledAt: new Date().toISOString(),
        },
    });

    await Promise.all([
        createNotification({
            recipientRole: "Vendor",
            recipientId: order.vendor,
            actorRole: "User",
            actorId: req.user._id,
            title: "Order cancelled by customer",
            message: `${order.orderId} was cancelled by ${req.user.name || order.customerName}.`,
            entityType: "order",
            entityId: String(order._id),
            metadata: {
                orderId: order.orderId,
                status: "Cancelled",
            },
        }),
        createNotification({
            recipientRole: "Admin",
            actorRole: "User",
            actorId: req.user._id,
            title: "Customer cancelled an order",
            message: `${order.orderId} was cancelled by ${req.user.name || order.customerName}.`,
            entityType: "order",
            entityId: String(order._id),
            metadata: {
                orderId: order.orderId,
                status: "Cancelled",
            },
        }),
    ]);

    return res.status(200).json(
        new ApiResponse(200, updatedOrder, "Order cancelled successfully")
    );
});

const askAiAssistant = asyncHandler(async (req, res) => {
    const prompt = req.body?.prompt?.trim();
    const apiKey = process.env.GEMINI_API_KEY?.trim();

    if (!prompt) {
        throw new ApiError(400, "Prompt is required");
    }

    if (!apiKey) {
        throw new ApiError(500, "AI assistant is not configured");
    }

    const systemPrompt = [
        "You are PharmaCare AI Assistant for a pharmacy marketplace.",
        "Help users with medication basics, side effects, pharmacy guidance, refill guidance, and general wellness information.",
        "Never claim to be a doctor and never provide a diagnosis.",
        "Encourage users to contact a licensed doctor or pharmacist for emergencies, pregnancy concerns, severe reactions, prescription-specific decisions, or dose changes.",
        "Keep answers practical, easy to read, and structured in short paragraphs or bullet points when helpful.",
    ].join(" ");

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const payload = {
        contents: [
            {
                role: "user",
                parts: [
                    {
                        text: `${systemPrompt}\n\nUser question: ${prompt}`,
                    },
                ],
            },
        ],
        generationConfig: {
            temperature: 0.5,
            topP: 0.9,
            maxOutputTokens: 700,
        },
    };

    let response;

    try {
        response = await axios.post(endpoint, payload, {
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        if (isQuotaError(error)) {
            return res.status(200).json(
                new ApiResponse(
                    200,
                    {
                        prompt,
                        reply: buildFallbackAssistantReply(prompt),
                        provider: "fallback",
                    },
                    "AI assistant fallback response generated successfully"
                )
            );
        }

        const providerMessage =
            error.response?.data?.error?.message ||
            error.message ||
            "Failed to reach AI provider";
        throw new ApiError(502, providerMessage);
    }

    const candidates = response.data?.candidates || [];
    const firstCandidate = candidates[0];
    const parts = firstCandidate?.content?.parts || [];
    const reply = parts
        .map((part) => part?.text || "")
        .join("\n")
        .trim();

    if (!reply) {
        throw new ApiError(502, "AI assistant did not return a response");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                prompt,
                reply,
            },
            "AI assistant response generated successfully"
        )
    );
});


export {registerUser,loginUser,logoutUser,getProfile, deleteUser, fetchCustomerOrders, cancelCustomerOrder, askAiAssistant}
