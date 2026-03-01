import React from "react";

const OuterLoginCard = ({ image, title, description, btnText, btnColor }) => {
    return (
        <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 transition-all duration-300 h-100 transform hover:scale-105 hover:shadow-2xl">

            {/* Image */}
            <div className="flex justify-center mb-4">
                <img src={image} alt={title} className="w-24 h-24 rounded-xl object-cover" />
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-gray-800 text-center">
                {title}
            </h2>

            {/* Description */}
            <p className="text-gray-600 text-sm mt-2 text-center whitespace-pre-line">
                {description}
            </p>

            {/* Button */}
            <button
                className={`mt-6 px-4 py-2 rounded-lg text-white font-medium transition-all duration-300 w-full ${btnColor}`}
            >
                {btnText}
            </button>
        </div>
    );
};

export default OuterLoginCard;