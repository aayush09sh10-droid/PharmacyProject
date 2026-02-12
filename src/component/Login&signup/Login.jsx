function Login() {
    const formWidth = "380px";
    
    return (
        <div
            style={{
                width: "448px",
                height: "508px",
                border: "2px solid",
                borderRadius: "var(--radius-2xl)",
                backgroundColor: "white",
                padding: "35px",
                boxShadow: "0 5px 15px rgba(0, 0, 0, 0.35)",
            }}
        >
            <h1
                style={{
                    textAlign: "center",
                    marginBottom: "20px",
                    color: "#181717",
                    fontSize: "45px",
                }}
            >
                Welcome Back
            </h1>

            <p
                style={{
                    textAlign: "center",
                    marginBottom: "30px",
                    color: "#0A0A0A",
                    fontSize: "20px",
                }}
            >
                Sign in to your PharmaCare account
            </p>

            {/* Form container */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                {/* Email */}
                <div style={{ width: formWidth }}>
                    <label
                        style={{
                            fontSize: "14px",
                            fontWeight: "500",
                            marginBottom: "6px",
                            display: "block",
                            color: "#0A0A0A",
                        }}
                    >
                        Email Address
                    </label>

                    <input
                        type="email"
                        placeholder="you@example.com"
                        style={{
                            width: "100%",
                            height: "44px",
                            padding: "0 12px",
                            marginBottom: "20px",
                            borderRadius: "10px",
                            border: "1px solid #d1d5db",
                            backgroundColor: "white",
                            outline: "none",
                            fontSize: "14px",
                        }}
                    />
                </div>

                {/* Password */}
                <div style={{ width: formWidth }}>
                    <label
                        style={{
                            fontSize: "14px",
                            fontWeight: "500",
                            marginBottom: "6px",
                            display: "block",
                            color: "#0A0A0A",
                        }}
                    >
                        Enter Password
                    </label>

                    <input
                        type="password"
                        placeholder="••••••••"
                        style={{
                            width: "100%",
                            height: "44px",
                            padding: "0 12px",
                            marginBottom: "16px",
                            borderRadius: "10px",
                            border: "1px solid #d1d5db",
                            backgroundColor: "white",
                            outline: "none",
                            fontSize: "14px",
                        }}
                    />
                </div>

                {/* Button */}
                <button
                    style={{
                        width: formWidth, 
                        height: "44px",
                        backgroundColor: "#2563eb",
                        color: "white",
                        border: "none",
                        borderRadius: "10px",
                        fontSize: "16px",
                        fontWeight: "500",
                        cursor: "pointer",
                        marginTop: "30px",
                        marginBottom: "20px",
                    }}
                >
                    Sign In
                </button>

                {/* Footer */}
                <div style={{ width: formWidth, textAlign: "center" }}>
                    <p
                        style={{
                            fontSize: "14px",
                            color: "#6b7280",
                        }}
                    >
                        Don't have an account?{" "}
                        <span
                            style={{
                                color: "#2563eb",
                                cursor: "pointer",
                                fontWeight: "500",
                            }}
                        >
                            Sign up
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;