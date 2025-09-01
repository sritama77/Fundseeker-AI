import { useState,useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import HomePage from './pages/home'
import FirstPage from './pages/first'
import SignupStartup from './pages/signupstartup'
import SignupInvestor from './pages/signupinvestor'
import LoginPage from './pages/loginpage'
import AboutPage from './pages/about'
import { Box, Flex, Image } from "@chakra-ui/react";
import ProfileStartupFirst from './pages/profilestartup_first'
import ProfileInvestorFirst from './pages/profileinvestor_first'
import ProfileStartupSecond from './pages/profilestartup_second'
import ProfileInvestorSecond from './pages/profileinvestor_second'
import StartMatchingPage from './pages/startmatching'
import UserDetails from './store/userform'
import  axios from "axios"
function App() {
const [page, setPage] = useState(8)
const [token,setToken] = useState(null)
const  {user,setUser} = UserDetails()

async function getUserDetails(token){

  if(token){
    const startupres = await axios.post(`${import.meta.env.VITE_SERVER_URL}/userdetailsstartup`, {
      "token": token
    })

    const investorres = await axios.post(`${import.meta.env.VITE_SERVER_URL}/userdetailsinvestor`, {
      "token": token
    })
     console.log(startupres,investorres)
    startupres?.data?.message === "user not found" ? setUser(investorres?.data?.message) : setUser(startupres?.data?.message)
  }
}


useEffect(()=>{
const temp = localStorage.getItem("token")
temp === null ? setToken(null) : setToken(temp)
getUserDetails(temp)
},[])

console.log("Current page:", page);
  return (
   <Box className='mainContainer'>
      <Box
      height= "100%"
    width={"100%"}
    display={"flex"}
      >
        {  
          page === 0? <FirstPage pageSet={setPage} /> :
           page===1 ? <SignupStartup pageSet={setPage} /> :
            page===2 ? <SignupInvestor pageSet={setPage}/> :
             page===3 ? <LoginPage pageSet={setPage}/> :
             page===4 ? <ProfileStartupFirst pageSet={setPage}/> :
             page===5 ? <ProfileInvestorFirst pageSet={setPage}/> :
             page===6 ? <ProfileStartupSecond pageSet={setPage}/> :
             page===7 ? <ProfileInvestorSecond pageSet={setPage}/> :
             page===8 ? <HomePage pageSet={setPage} currentPage={page}/> :
             page===9 ? <AboutPage pageSet={setPage} currentPage={page}/> :
             page===11 ? <StartMatchingPage pageSet={setPage} currentPage={page}/> :

             <></>
        }
      </Box>
    </Box>
  )
}

export default App