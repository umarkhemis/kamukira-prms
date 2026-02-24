import React from 'react';

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-3 px-6">
      <p className="text-xs text-gray-400 text-center">
        © {new Date().getFullYear()} Kamukira Health Centre IV — Patient Records Management System
      </p>
    </footer>
  );
}

export default Footer;
