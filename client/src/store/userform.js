import { create } from "zustand";

const UserDetails = create((set)=>({
    user:[],
    Reload:false,
    setUser:(data) => set({user:data}),
    setReload:(data)=>set({Reload:data})
}))


export default UserDetails