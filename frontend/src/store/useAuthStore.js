import {create} from "zustand";
import { axiosInstance } from '../lib/axios.js';
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE == "development" ? "http://localhost:3001" : "/";

export const useAuthStore = create((set, get)=>({
    authUser : null,
    isLoggingIn : false,
    isSigningUp : false,
    isUpdatingProfile : false,
    isCheckingAuth : true,
    onlineUsers : [],

    checkAuth : async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({authUser : res.data});
            get().connectSocket();
        } catch (error) {
            console.log("Error checking auth:", error);
            set({authUser : null});
        }finally{
            set({isCheckingAuth : false});
        }
    },
    signUp : async (data) => {
        set({isSigningUp : true});
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({authUser : res.data});
            toast.success("Account created successfully!");
            get().connectSocket();
        } catch (error) {
            toast.error(error.response?.data?.message || "Signup failed. Please try again.");
        } finally {
            set({isSigningUp : false});
        }
    },
    logOut : async () => {
        try {
            await axiosInstance.post("/auth/logout");
            console.log("1")
            set({authUser : null});
            console.log("2")
            get().disconnectSocket();
            console.log("3")
            console.log("4")
            toast.success("Logged out successfully");
            console.log("5")
        } catch (error) {
            toast.error(error.response?.data?.message || "Logout failed. Please try again.");
        }
    },
    login : async (data) => {
        set({isLoggingIn : true});
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({authUser : res.data});
            toast.success("Logged in successfully!");
            get().connectSocket();
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed. Please try again."); 
        }
        finally {
            set({isLoggingIn : false});
        }
    },
    updateProfile : async (data) => {
        set({isUpdatingProfile : true})
        try {
            const res = await axiosInstance.patch("/auth/updateProfile",data);
            set((state) => ({
                authUser : {...state.authUser , ...res.data}
            }))




            toast.success("profile updated successfully");
        } catch (error) {
            console.log("Error updating profile:", error);
            toast.error(error.response?.data?.message || "Profile update failed. Please try again.");
        } finally{
            set({isUpdatingProfile : false})
        }
    },
    connectSocket : () => {
        const {authUser} = get();
        if (!authUser || get().socket?.connected) {
            return;
        }
        const socket = io(BASE_URL,{
            auth : {
                userId : authUser._id,
            }
        });
        socket.connect();
        console.log("Socket connected", socket.id);
        set({socket : socket});

        socket.on("getOnlineUsers", (userIds) => {
            set({onlineUsers : userIds})
        })
    },
    disconnectSocket : ()=>{
        if (get().socket?.connected) {
            get().socket.disconnect();
        }
        console.log("Socket disconnected")
        // set({socket : null});
    },
}));