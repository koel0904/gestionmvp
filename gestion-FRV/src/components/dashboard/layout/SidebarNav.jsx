import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function SidebarNav({ sidebarOpen, dynamicLinks, location, onReorder }) {
    const [dragIndex, setDragIndex] = useState(null);
    const [overIndex, setOverIndex] = useState(null);
    const dragNode = useRef(null);

    const handleDragStart = (e, index) => {
        setDragIndex(index);
        dragNode.current = e.target;
        // Make the drag image semi-transparent
        e.dataTransfer.effectAllowed = 'move';
        // Small delay so the dragged item renders before going transparent
        setTimeout(() => {
            dragNode.current?.classList.add('opacity-30');
        }, 0);
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (dragIndex === null || dragIndex === index) return;
        setOverIndex(index);
    };

    const handleDragEnter = (e, index) => {
        e.preventDefault();
        if (dragIndex === null || dragIndex === index) return;
        setOverIndex(index);
    };

    const handleDragLeave = (e) => {
        // Only clear if we're leaving the element entirely (not entering a child)
        if (e.currentTarget.contains(e.relatedTarget)) return;
        setOverIndex(null);
    };

    const handleDrop = (e, dropIndex) => {
        e.preventDefault();
        if (dragIndex === null || dragIndex === dropIndex) {
            resetDrag();
            return;
        }
        // Reorder
        const reordered = [...dynamicLinks];
        const [moved] = reordered.splice(dragIndex, 1);
        reordered.splice(dropIndex, 0, moved);
        onReorder(reordered);
        resetDrag();
    };

    const handleDragEnd = () => {
        resetDrag();
    };

    const resetDrag = () => {
        if (dragNode.current) {
            dragNode.current.classList.remove('opacity-30');
        }
        setDragIndex(null);
        setOverIndex(null);
        dragNode.current = null;
    };

    return (
        <nav className="flex-1 overflow-y-auto overflow-x-hidden space-y-1.5 p-3 custom-scrollbar">
            {dynamicLinks.map((link, index) => {
                const isActive = location.pathname === link.path;
                const isDragging = dragIndex === index;
                const isOver = overIndex === index;

                return (
                    <div
                        key={link.path}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragEnter={(e) => handleDragEnter(e, index)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, index)}
                        onDragEnd={handleDragEnd}
                        className={`relative transition-all duration-150 rounded-xl ${isDragging ? 'opacity-30' : ''
                            } ${isOver && !isDragging
                                ? 'before:absolute before:inset-x-2 before:-top-1 before:h-0.5 before:bg-gradient-to-r before:from-primary-light before:to-primary-dark before:rounded-full before:z-20'
                                : ''
                            }`}
                    >
                        <Link
                            to={link.path}
                            title={!sidebarOpen ? link.name : undefined}
                            onClick={(e) => {
                                // Prevent navigation while dragging
                                if (dragIndex !== null) e.preventDefault();
                            }}
                            className={`flex items-center p-2 rounded-xl transition-all duration-300 group relative overflow-hidden box-border ${isActive
                                ? "bg-white/[0.06] text-white shadow-lg border border-white/10"
                                : "text-white/60 hover:text-white hover:bg-white/[0.03] border border-transparent"
                                }`}
                        >
                            {isActive && (
                                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent pointer-events-none" />
                            )}

                            {/* Drag handle — visible on hover when sidebar is open */}
                            <div
                                className={`shrink-0 flex items-center justify-center cursor-grab active:cursor-grabbing relative z-10 transition-all duration-200 ${sidebarOpen
                                        ? 'w-5 opacity-0 group-hover:opacity-60 hover:!opacity-100 -mr-1'
                                        : 'w-0 opacity-0 overflow-hidden'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-[16px] text-white/40">
                                    drag_indicator
                                </span>
                            </div>

                            <div
                                className={`w-10 h-10 flex items-center justify-center shrink-0 relative z-10 transition-transform group-hover:scale-110 ${!sidebarOpen && "mx-auto"}`}
                            >
                                <span
                                    className={`material-symbols-outlined transition-all duration-300 ${isActive
                                        ? "text-transparent bg-clip-text bg-gradient-to-br from-primary-light to-primary-dark drop-shadow-[0_0_8px_rgba(124,58,237,0.4)] scale-110"
                                        : "text-[22px] text-white/40 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-br group-hover:from-primary-light group-hover:to-primary-dark group-hover:drop-shadow-[0_0_8px_rgba(124,58,237,0.6)]"
                                        }`}
                                >
                                    {link.icon}
                                </span>
                            </div>
                            <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out whitespace-nowrap flex items-center relative z-10 ${sidebarOpen
                                    ? "max-w-[160px] opacity-100 ml-2"
                                    : "max-w-0 opacity-0 ml-0"
                                    }`}
                            >
                                <span className="text-sm font-semibold">{link.name}</span>
                            </div>
                        </Link>
                    </div>
                );
            })}
        </nav>
    );
}
