'use client';
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardTitle} from "@/components/ui/card";
import {useState} from "react";
import { Input } from "@/components/ui/input";

interface Message {
    text: string;
    isUser: boolean;
}

export default function ChatComponent() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState('');

    const sendMessage = () => {
        if (inputMessage.trim()) {
            setMessages([...messages, { text: inputMessage, isUser: true }]);
            setInputMessage('');
            // Here you would typically send the message to your AI and get a response
            // For this example, we'll just simulate a response after a short delay
            setTimeout(() => {
                setMessages(prev => [...prev, { text: "This is a simulated AI response.", isUser: false }]);
            }, 1000);
        }
    };

    return (
        <>
            {!isOpen && (
                <Button
                    className="fixed bottom-4 right-4 rounded-full w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                    onClick={() => setIsOpen(true)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                </Button>
            )}
            {isOpen && (
                <Card className="fixed bottom-4 right-4 w-80 h-96 flex flex-col bg-[#0c0a09] text-white border-[#221f1e]">
                    <CardTitle className="p-4 border-b border-[#221f1e] flex justify-between items-center">
                        <span>Chat with AI</span>
                        <Button variant="ghost" onClick={() => setIsOpen(false)}>X</Button>
                    </CardTitle>
                    <CardContent className="flex-grow overflow-auto p-4">
                        {messages.map((message, index) => (
                            <div key={index} className={`mb-2 ${message.isUser ? 'text-right' : 'text-left'}`}>
                                <span className={`inline-block p-2 rounded-lg ${message.isUser ? 'bg-blue-500' : 'bg-gray-700'}`}>
                                    {message.text}
                                </span>
                            </div>
                        ))}
                    </CardContent>
                    <div className="p-4 border-t border-[#221f1e] flex">
                        <Input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                            placeholder="Type a message..."
                            className="flex-grow mr-2"
                        />
                        <Button onClick={sendMessage} className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                            Send
                        </Button>
                    </div>
                </Card>
            )}
        </>
    );
}