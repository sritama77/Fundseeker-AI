import React from 'react';
import { LogOut } from 'lucide-react';

const sideNavStyles = `
  .side-nav-link {
    font-family: Poppins, sans-serif;
    font-size: 16px;
    color: white;
    font-weight: 400;
    cursor: pointer;
    position: relative;
    transition: all 0.3s ease;
    padding: 12px 24px;
    text-decoration: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    border-radius: 8px;
    margin: 4px 0;
    overflow: hidden;
  }

  .side-nav-link::after {
    content: '';
    position: absolute;
    width: 0%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: transparent;
    transition: all 0.3s ease;
    z-index: -1;
  }

  /* Hover effect for non-active links */
  .side-nav-link:not(.active):not(.logout):hover {
    color: #E5C48A;
    transform: translateX(8px);
  }

  .side-nav-link:not(.active):not(.logout):hover::after {
    width: 100%;
    background-color: rgba(229, 196, 138, 0.1);
  }

  /* Styles for the active/selected link */
  .side-nav-link.active {
    background-color: #E5C48A;
    color: #011F3C;
    font-weight: 500;
    transform: translateX(4px);
  }

  /* Special styles for logout button */
  .side-nav-link.logout {
    background-color: #CF1818;
    color: white;
    margin-top: auto;
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: center;
  }

  .side-nav-link.logout:hover {
    background-color: #B91515;
    transform: translateX(4px) scale(1.02);
    box-shadow: 0 4px 12px rgba(207, 24, 24, 0.3);
  }

  .useNunito {
    font-family: 'Nunito', sans-serif;
  }
`;

const SideNavLink = ({ page, currentPage, handlePageSelect, children, isLogout = false }) => {
    const isActive = currentPage === page;
    const className = `side-nav-link ${isActive ? 'active' : ''} ${isLogout ? 'logout' : ''}`;
    
    return (
        <span 
            className={className} 
            onClick={() => !isLogout && handlePageSelect && handlePageSelect(page)}
        >
            {children}
        </span>
    );
};

const SideNavbar = ({ currentPage, pageSet,LogoutRedirect }) => {
    const handlePageSelect = (pageNumber) => {
        if (pageSet) {
            pageSet(pageNumber);
        }
    };

    return (
        <div style={{
            height: "100vh",
            width: "300px",
            backgroundColor: "#00172B",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "20px 0",
            boxShadow: "10px 4px 25px rgba(0, 0, 0, 0.25)",
            position: "fixed",
            left: 0,
            top: 0,
            zIndex: 1000
        }}>
            {/* Inject the styles into the component */}
            <style>{sideNavStyles}</style>

            {/* FundSeeker Logo Section */}
            <div style={{
                height: "15%",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                gap: "8px",
                //backgroundColor: "white"
            }}>
                <img
                    src="/fundseeker_logo.png"
                    alt="Fundseeker Logo"
                    style={{ 
                        height: "40%", 
                        width: "auto", 
                        display: "flex" 
                    }}
                    onError={(e) => { 
                        e.target.onerror = null; 
                        e.target.src = 'https://placehold.co/80x60/00172B/ffffff?text=FS'; 
                    }}
                />
                
                <span style={{
                    fontFamily: "Nunito, sans-serif",
                    color: "#D2B47D",
                    fontSize: "15px",
                    letterSpacing: "1px",
                    fontWeight: 400,
                    textAlign: "center"
                }}>
                    FundSeeker AI
                </span>
            </div>

            {/* Golden Line */}
            <div style={{
                height: "1px",
                width: "86%",
                borderRadius: "50px",
                backgroundColor: "#E5C48A",
                marginTop: "4px"
            }} />

            {/* Navigation Links Container */}
            <div style={{
                height: "100%",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                padding: "32px 20px 0 20px",
                gap: "8px",
                position: "relative"
            }}>
                <SideNavLink page={0} currentPage={currentPage} handlePageSelect={handlePageSelect}>
                    Start Matching
                </SideNavLink>
                
                <SideNavLink page={1} currentPage={currentPage} handlePageSelect={handlePageSelect}>
                    View Saved Database
                </SideNavLink>
                
                <SideNavLink page={2} currentPage={currentPage} handlePageSelect={handlePageSelect}>
                    Success Stories
                </SideNavLink>
                
                <SideNavLink page={3} currentPage={currentPage} handlePageSelect={handlePageSelect}>
                    Leaderboard
                </SideNavLink>
                
                <SideNavLink page={4} currentPage={currentPage} handlePageSelect={handlePageSelect}>
                    Notifications
                </SideNavLink>
                
                <SideNavLink page={5} currentPage={currentPage} handlePageSelect={handlePageSelect}>
                    View Profile
                </SideNavLink>
                
                {/* Spacer to push logout to bottom */}
                <div style={{ flex: 1 }} />
                
                {/* Logout Button */}
                <button className='logout' onClick={()=>{
                    localStorage.removeItem("token")
                    LogoutRedirect(0)
                }}>
                    <LogOut size={18} />
                    LOGOUT
                </button>
                    
               
            </div>
        </div>
    );
};

export default SideNavbar;