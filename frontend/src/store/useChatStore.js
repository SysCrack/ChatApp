import {create} from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { toast } from 'react-hot-toast';
import { useAuthStore } from "./useAuthStore.js";

export const useChatStore = create((set,get)=> ({
    messages : [],
    users : [],
    selectedUser : null,
    isUsersLoading : false,
    isMessagesLoading : false,
    isSendingMessage : false,
    getUsers : async () => {
        set({isUsersLoading : true});
        try {
            const res = await axiosInstance.get("/message/users");
            set({users : res.data.filteredUser})
        } catch (error) {
            toast.error(error.response?.data?.message || "error in getting Users ")
        } finally {
            set({isUsersLoading : false});
        }
    },
    getMessages : async (userId) => {
        set({isMessagesLoading : true})
        try {
            const res = await axiosInstance.get(`/message/${userId}`);
            console.log("data at getmessage",res.data);
            set({messages : res.data.messages});
        } catch (error) {
            toast.error(error.response?.data?.message || "error in getting Message ");
        } finally {
            set({isMessagesLoading : false});
        }
    },
    sendMessage : async (messageData) => {
        set({isSendingMessage : true})
        const {selectedUser, messages } = get();
        try {
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`,messageData);
            console.log("new message",res.data)
            set({messages : [...messages ,res.data.newMessage]})
        } catch (error) {
            console.log("error in sendMessage",error)
            toast.error(error.response?.data?.message || "error in getting Message ");
        } finally {
            set({isSendingMessage : false});
        }
    },

    setSelectedUser : (selectedUser) => { set({selectedUser});},

    subscribeToMessages : () => {
        const {selectedUser} = get();

        if(!selectedUser) return;
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
        socket.on("newMessage", (newMessage) => {
            if (newMessage.senderId !== selectedUser._id) {
                return ;
            }
            set({messages : [...get().messages, newMessage]})
        })
    },
    unsubscribeFromMessages : () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },

}));