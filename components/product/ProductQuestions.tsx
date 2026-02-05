"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { MessageCircle, Check, User } from "lucide-react";
import { format } from "date-fns"; // Make sure to handle if date-fns not available or just use native date

interface Question {
    _id: string;
    product: string;
    name: string;
    message: string;
    status: string;
    answer?: string;
    answeredAt?: string;
    createdAt: string;
}

interface ProductQuestionsProps {
    productId: string;
}

export default function ProductQuestions({ productId }: ProductQuestionsProps) {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (productId) {
            fetchQuestions();
        }
    }, [productId]);

    const fetchQuestions = async () => {
        try {
            const res = await api.get(`/api/questions?productId=${productId}`);
            if (res.data.success) {
                // Only show answered questions or all? Usually only answered or user's own.
                // For now, let's show all, but visually distinguish answered ones.
                // Or filter to only answered ones if the user wants "user show that answer" implies specific interest in answers.
                // Let's show all but highlight answers.
                setQuestions(res.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch product questions", error);
        } finally {
            setLoading(false);
        }
    };

    // Filter only questions that have answers for public view? 
    // Usually "Q&A" sections show questions even if unanswered if they allow community answers, but here it's admin reply.
    // Let's show all for now, maybe the user wants to see their pending question too.
    const displayQuestions = questions.filter(q => q.status === 'answered' || q.answer);

    if (displayQuestions.length === 0) return null;

    return (
        <div className="py-12 border-t border-gray-200 dark:border-white/10">
            <h2 className="text-2xl font-bold mb-8 text-black dark:text-white flex items-center gap-2">
                Questions & Answers
            </h2>

            <div className="space-y-6">
                {displayQuestions.map((q) => (
                    <div key={q._id} className="bg-gray-50 dark:bg-white/5 p-6 rounded-lg">
                        <div className="flex gap-3 mb-3">
                            <div className="mt-1 w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs font-bold text-gray-500">
                                Q
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white text-base">
                                    {q.message}
                                </h4>
                                <p className="text-xs text-gray-500 mt-1">
                                    Asked by {q.name} on {new Date(q.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        {q.answer && (
                            <div className="flex gap-3 ml-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                                <div className="mt-1 w-6 h-6 bg-black text-white dark:bg-white dark:text-black rounded-full flex items-center justify-center text-xs font-bold">
                                    A
                                </div>
                                <div>
                                    <p className="text-gray-700 dark:text-gray-300">
                                        {q.answer}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Answered by Admin {q.answeredAt && `on ${new Date(q.answeredAt).toLocaleDateString()}`}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
