import { create } from "zustand";

const UserDetails = create((set)=>({
    user:[],
    setUser:(data) => set({user:data})
}))


export default UserDetails