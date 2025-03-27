"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { collection, addDoc, query, where, orderBy, onSnapshot } 
from "firebase/firestore";
import { db } from "../firebase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Mic } from "lucide-react";
import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav";

export default function Page() {
    const { currentUser } = useAuth();
    const router = useRouter();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);

    useEffect(() => {
        if (!currentUser) {
            router.push("/login");
            return;
        }

        const messagesRef = collection(db, "messages");
        const q = query(messagesRef, where("userId", "==", currentUser.uid), orderBy("createdAt", "asc"));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const messagesData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setMessages(messagesData);
        });

        return () => unsubscribe();
    }, [currentUser, router]);

    // ✅ Auto-scroll to the latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        setLoading(true);

        // ✅ Store user message in Firebase
        await addDoc(collection(db, "messages"), {
            userId: currentUser.uid,
            text: newMessage,
            sender: "user",
            createdAt: new Date(),
        });

        try {
            // ✅ Call FastAPI backend
            const response = await fetch("https://financialadvisor.onrender.com/financial_advice", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: currentUser.uid,
                    query: newMessage,
                }),
            });

            const data = await response.json();

            // ✅ Store AI response in Firebase
            await addDoc(collection(db, "messages"), {
                userId: currentUser.uid,
                text: data.response,
                sender: "ai",
                createdAt: new Date(),
            });

        } catch (error) {
            console.error("Error calling API:", error);
        }

        setNewMessage(""); // Clear input field
        setLoading(false);
    };

    const handleSpeech = () => {
        if (!recognitionRef.current) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) {
                alert("Speech recognition is not supported in this browser.");
                return;
            }
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = "en-US";

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setNewMessage(transcript);
            };

            recognitionRef.current.onend = () => setIsListening(false);
        }

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    return (
        <div className="flex flex-col h-screen p-4">
            {/* Navbar */}
            <Navbar />
    
            <ScrollArea className="flex-1 overflow-y-auto border rounded p-4">
                {messages.map((msg) => (
                    <div 
                        key={msg.id} 
                        className={`mb-2 p-2 border rounded ${
                            msg.sender === "user" ? "bg-blue-100 text-blue-900" : "bg-gray-100 text-gray-900"
                        }`}
                    >
                        {msg.text}
                    </div>
                ))}
                {/* ✅ This ensures scrolling to the latest message */}
                <div ref={messagesEndRef} />
            </ScrollArea>
    
            {/* Adjusted Input Section */}
            <div className="flex items-center gap-2 mt-2 mb-16">
                <Input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message"
                    disabled={loading}
                />
                <Button onClick={handleSpeech} variant={isListening ? "destructive" : "default"}>
                    <Mic />
                </Button>
                <Button onClick={sendMessage} disabled={loading}>
                    {loading ? "Sending..." : <Send />}
                </Button>
            </div>
    
            {/* Bottom Navigation */}
            <BottomNav />
        </div>
    );
}
