// components/GoogleDocsContextMenu.jsx
import React, { useEffect, useRef, useState } from 'react';
import {
  FolderPlusIcon,
  ArrowUpTrayIcon,
  FolderIcon,
  PencilIcon,
  ArrowRightCircleIcon,
  LockClosedIcon,
  LockOpenIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  DocumentDuplicateIcon,
  ShareIcon,
  InformationCircleIcon,
  LinkIcon,
  ClipboardIcon,
  MagnifyingGlassIcon,
  PrinterIcon,
  LanguageIcon,
  DevicePhoneMobileIcon,
  EyeIcon,
  CommandLineIcon,
  MusicalNoteIcon,
  PaintBrushIcon,
  DocumentTextIcon,
  Square3Stack3DIcon,
  ChevronRightIcon,
  ArrowTopRightOnSquareIcon,
  WindowIcon,
  Squares2X2Icon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

// Submenu component for nested items
const SubMenuItem = ({ item, onAction, onClose, level = 0 }) => {
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const [subMenuPosition, setSubMenuPosition] = useState({ x: 0, y: 0 });
  const itemRef = useRef(null);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (item.subMenu) {
      // Clear any pending close timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      const rect = itemRef.current?.getBoundingClientRect();
      if (rect) {
        // Position submenu to the right
        let left = rect.right;
        let top = rect.top;
        
        // Check if submenu would go off screen
        const subMenuWidth = 280;
        const subMenuHeight = 300;
        
        if (left + subMenuWidth > window.innerWidth - 10) {
          left = rect.left - subMenuWidth;
        }
        
        if (top + subMenuHeight > window.innerHeight - 10) {
          top = window.innerHeight - subMenuHeight - 10;
        }
        
        if (top < 10) top = 10;
        
        setSubMenuPosition({ left, top });
      }
      setSubMenuOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (item.subMenu) {
      // Delay closing to allow moving to submenu
      timeoutRef.current = setTimeout(() => {
        setSubMenuOpen(false);
      }, 100);
    }
  };

  const handleSubMenuMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleSubMenuMouseLeave = () => {
    if (item.subMenu) {
      timeoutRef.current = setTimeout(() => {
        setSubMenuOpen(false);
      }, 100);
    }
  };

  if (item.separator) {
    return <div className="my-1 h-px bg-[#E8EAED]" />;
  }

  const Icon = item.icon;
  const isDanger = item.danger || item.action === 'delete' || item.action === 'trash';
  const isDisabled = item.disabled;

  // Render submenu items
  const renderSubMenu = () => {
    if (!item.subMenu || !subMenuOpen) return null;

    return (
      <div
        className="fixed z-[60] min-w-[220px] max-w-[280px] bg-white rounded-lg shadow-[0_2px_10px_rgba(0,0,0,0.2)] border border-[#DADCE0] py-1 animate-in fade-in zoom-in-95 duration-100"
        style={{
          left: `${subMenuPosition.left}px`,
          top: `${subMenuPosition.top}px`,
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
        onMouseEnter={handleSubMenuMouseEnter}
        onMouseLeave={handleSubMenuMouseLeave}
      >
        {item.subMenu.map((subItem, idx) => (
          <SubMenuItem
            key={idx}
            item={subItem}
            onAction={onAction}
            onClose={onClose}
            level={level + 1}
          />
        ))}
      </div>
    );
  };

  return (
    <div
      ref={itemRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={() => {
          if (!isDisabled && !item.subMenu) {
            onAction(item.action);
            onClose();
          }
        }}
        disabled={isDisabled}
        className={`
          w-full flex items-center gap-3 px-4 py-1.5 text-sm transition-all duration-100
          ${isDisabled 
            ? 'opacity-40 cursor-not-allowed text-[#80868B]' 
            : isDanger
              ? 'text-[#D93025] hover:bg-[#FCE8E6]'
              : 'text-[#202124] hover:bg-[#F1F3F4]'
          }
          ${level > 0 ? 'pl-8' : ''}
          min-h-[32px]
          relative
        `}
      >
        {Icon && (
          <Icon 
            className={`
              h-4 w-4 flex-shrink-0
              ${isDisabled ? 'text-[#80868B]' : isDanger ? 'text-[#D93025]' : 'text-[#5F6368]'}
            `}
          />
        )}
        <span className="flex-1 text-left text-[13px] font-normal">{item.name}</span>
        {item.shortcut && (
          <span className="text-[11px] text-[#80868B] font-mono ml-4">
            {item.shortcut}
          </span>
        )}
        {item.subMenu && (
          <ChevronRightIcon className="h-4 w-4 text-[#80868B] ml-2" />
        )}
      </button>
      {renderSubMenu()}
    </div>
  );
};

// Main Context Menu Component
const GoogleDocsContextMenu = ({ 
  x, 
  y, 
  items, 
  onClose, 
  onAction,
  fileName 
}) => {
  const menuRef = useRef(null);
  const [position, setPosition] = useState({ left: x, top: y });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    // Adjust menu position to stay within viewport
    const adjustPosition = () => {
      const menuWidth = 320;
      const menuHeight = 500;
      const padding = 10;

      let left = x;
      let top = y;

      if (left + menuWidth > window.innerWidth - padding) {
        left = window.innerWidth - menuWidth - padding;
      }

      if (top + menuHeight > window.innerHeight - padding) {
        top = window.innerHeight - menuHeight - padding;
      }

      if (left < padding) left = padding;
      if (top < padding) top = padding;

      setPosition({ left, top });
    };

    adjustPosition();
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [x, y, onClose]);

  return (
    <div
      ref={menuRef}
      className="fixed z-50 min-w-[260px] max-w-[320px] bg-white rounded-lg shadow-[0_2px_10px_rgba(0,0,0,0.2)] border border-[#DADCE0] py-1 animate-in fade-in zoom-in-95 duration-100"
      style={{
        left: `${position.left}px`,
        top: `${position.top}px`,
        maxHeight: '90vh',
        overflowY: 'auto',
      }}
    >
      {items.map((item, index) => (
        <SubMenuItem
          key={index}
          item={item}
          onAction={onAction}
          onClose={onClose}
        />
      ))}
    </div>
  );
};

export default GoogleDocsContextMenu;