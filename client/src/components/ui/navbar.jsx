import React from 'react'; // Make sure to import React
import { CircleUserRound } from 'lucide-react';

/**
 * This component now uses standard HTML elements and CSS-in-JS 
 * to avoid external dependencies like Chakra UI, resolving the compilation error.
 * A <style> tag is injected to handle hover effects and pseudo-elements.
 */

// We define the styles here to be injected into the document head.
// This is how we handle pseudo-selectors like ::after and :hover without a CSS-in-JS library.
const navStyles = `
  .nav-link {
    font-family: Poppins, sans-serif;
    font-size: 18px;
    color: white;
    font-weight: 400;
    cursor: pointer;
    position: relative;
    transition: all 0.3s ease;
    padding: 8px 16px;
    text-decoration: none; /* Remove default underline from links */
    -webkit-user-select: none; /* Disable text selection */
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .nav-link::after {
    content: '';
    position: absolute;
    width: 0%;
    height: 2px;
    bottom: 0px;
    left: 50%;
    transform: translateX(-50%);
    background-color: transparent;
    transition: all 0.3s ease;
  }

  /* Hover effect for non-active links */
  .nav-link:not(.active):hover {
    color: #E5C48A;
  }

  .nav-link:not(.active):hover::after {
    width: 100%;
    background-color: #E5C48A;
  }

  /* Styles for the active link */
  .nav-link.active {
    color: #E5C48A;
    font-weight: 500;
  }
`;


/**
 * NavLink is a reusable component for displaying each navigation item.
 * It uses CSS classes defined above to handle active and hover states.
 */
const NavLink = ({ page, currentPage, handlePageSelect, children }) => {
    const isActive = currentPage === page;
    // Conditionally apply the 'active' class
    const className = `nav-link ${isActive ? 'active' : ''}`;
    console.log(page,currentPage)
    return (
        <span className={className} onClick={() => handlePageSelect(page)}>
            {children}
        </span>
    );
};

const Navbar = ({ currentPage, pageSet }) => {
    const handlePageSelect = (pageNumber) => {
        if (pageSet) {
            pageSet(pageNumber);
        }
    };

    // All Chakra UI props have been converted to standard inline CSS styles.
    return (
        <div style={{ height: "80px", width: "100%", display: "flex", justifyContent: "flex-start", alignItems: "center",position: "fixed", zIndex: 1000, left: 0, top: 0}}>
            {/* Inject the styles into the component */}
            <style>{navStyles}</style>

            {/* Fundseeker Logo */}
            <div style={{ height: "95%", width: "10%", display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", gap: '4px', paddingTop: '8px' }}>
                <img
                    src="/fundseeker_logo.png"
                    alt="Fundseeker Logo"
                    style={{ height: "80%", width: "auto", display: "flex" }}
                    onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/100x80/1a1a1a/ffffff?text=Logo'; }}
                />
            </div>

            {/* Navigation Links Container */}
            <div style={{ height: "100%", width: "80%", display: "flex", justifyContent: "center", flexDirection: "row", alignItems: "center", gap: '8px' }}>
                <div style={{
                    height: "60%",
                    width: "60%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(217, 217, 217, 0.3)",
                    borderRadius: "50px",
                    backdropFilter: "blur(10px)",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                    padding: "0 32px",
                    gap: "144px", // This was 'gap={36}' which is 144px in Tailwind
                    position: "relative",
                    overflow: "hidden"
                }}>
                    <NavLink page={9} currentPage={currentPage} handlePageSelect={handlePageSelect}>
                        ABOUT
                    </NavLink>
                    <NavLink page={8} currentPage={currentPage} handlePageSelect={handlePageSelect}>
                        HOME
                    </NavLink>
                    <NavLink page={10} currentPage={currentPage} handlePageSelect={handlePageSelect}>
                        PRICING
                    </NavLink>
                </div>
            </div>

            {/* Profile Icon */}
            <div style={{ height: "100%", width: "10%", display: "flex", justifyContent: "center", flexDirection: "row", alignItems: "center", gap: '8px' }}>
                <CircleUserRound
                    height={"50%"}
                    width={"auto"}
                    color={'white'}
                    strokeWidth={1.5}
                />
            </div>
        </div>
    );
};

export default Navbar;
