import React from "react";

const RoleCard = ({ image, title, description, btnText, btnColor, onClick }) => {
    return (
        <div className="flex h-full min-h-[22rem] flex-col rounded-3xl border border-gray-100 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:p-8">

            <div className="mb-4 flex justify-center">
                <img src={image} alt={title} className="h-20 w-20 rounded-2xl object-cover sm:h-24 sm:w-24" />
            </div>

            <h2 className="text-center text-lg font-bold text-gray-800 sm:text-xl">
                {title}
            </h2>

            <p className="mt-3 flex-1 whitespace-pre-line text-center text-sm leading-6 text-gray-600">
                {description}
            </p>

            <button
                onClick={onClick}
                className={`mt-6 w-full rounded-xl px-4 py-3 text-sm font-medium text-white transition-all duration-300 sm:text-base ${btnColor} hover:opacity-90`}
            >
                {btnText}
            </button>
        </div>
    );
};

export default RoleCard;
