interface SocialButtonProps {
    icon: React.ReactNode;
    text: string;
    onClick: () => void;
}

// Reusable Social Button Component
const SocialButton: React.FC<SocialButtonProps> = ({ icon, text, onClick }) => (
    <button
        onClick={onClick}
        className="flex items-center justify-center gap-3 w-full py-3 px-4 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors border border-gray-200"
    >
        {icon}
        <span className="font-medium text-sm">{text}</span>
    </button>
);

export default SocialButton;
