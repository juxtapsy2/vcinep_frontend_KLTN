import React from "react";
import {
  FaShareAlt,
  FaFacebookF,
  FaTwitter,
  FaPinterestP,
  FaLinkedinIn,
} from "react-icons/fa";

function SocialShare() {
  const socialIcons = [
    { Icon: FaFacebookF, color: "#1877f2", hover: "#1864d2" },
    { Icon: FaTwitter, color: "#1da1f2", hover: "#1a8cd8" },
    { Icon: FaPinterestP, color: "#e60023", hover: "#cc0000" },
    { Icon: FaLinkedinIn, color: "#0a66c2", hover: "#094da2" },
  ];

  return (
    <div className="flex items-center gap-3">
      <span className="text-gray-600 text-sm font-medium flex items-center gap-2">
        <FaShareAlt className="text-red-500" />
        Chia sẻ:
      </span>
      <div className="flex gap-2">
        {socialIcons.map(({ Icon, color, hover }) => (
          <SocialButton key={color} Icon={Icon} color={color} hover={hover} />
        ))}
      </div>
    </div>
  );
}

function SocialButton({ Icon, color, hover }) {
  return (
    <button
      className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
      style={{
        backgroundColor: `${color}15`,
        color: color,
      }}
      onMouseOver={(e) =>
        (e.currentTarget.style.backgroundColor = `${hover}25`)
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.backgroundColor = `${color}15`)
      }
    >
      <Icon className="text-sm" />
    </button>
  );
}

export default SocialShare;
