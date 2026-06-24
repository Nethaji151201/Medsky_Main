import React from "react"

// Import Image
import logo from "/assets/images/logo.png"

const Logo = () => {
    return (
        <>
            <div className="logo-main">
                <img className="logo-normal img-fluid mb-3" src="/medsky_logo.png" height="30" alt="logo" />{" "}
                <span className="ms-2 brand-name">Medsky</span>
            </div>
        </>
    )
}

export default Logo