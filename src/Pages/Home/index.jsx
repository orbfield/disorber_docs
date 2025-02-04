import React from "react";
import { ChevronRight, ChevronDown, Move, ZoomIn, Maximize2 } from 'lucide-react';

const Home = () => {
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-xl font-medium mb-6 text-gray-400">disorber</h1>

      <div className="space-y-6">
        <div className="p-6 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700">
          <h2 className="text-lg font-medium mb-4 text-gray-200 flex items-center gap-2">
            <Move className="w-4 h-4" />
            Canvas Navigation
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-gray-300">
                <div className="p-2 bg-gray-700/50 rounded">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M8 8l4-4 4 4" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M8 16l4 4 4-4" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M16 8l4 4-4 4" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M8 8l-4 4 4 4" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Drag to Pan</p>
                  <p className="text-sm text-gray-400">Click and drag anywhere on the canvas to move around</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-gray-300">
                <div className="p-2 bg-gray-700/50 rounded">
                  <ZoomIn className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">Mouse Wheel to Zoom</p>
                  <p className="text-sm text-gray-400">Scroll to zoom in/out, centered on mouse position</p>
                </div>
              </div>
            </div>
            <div className="relative h-32 bg-gray-900/50 rounded overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 to-gray-900/20" />
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-gray-400 text-sm">Interactive Preview</div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700">
          <h2 className="text-lg font-medium mb-4 text-gray-200 flex items-center gap-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 3v18h18" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="9" cy="9" r="2" strokeWidth="2"/>
              <circle cx="15" cy="15" r="2" strokeWidth="2"/>
              <path d="M9 11v4h6" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Tree Navigation
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-gray-300">
                <div className="p-2 bg-gray-700/50 rounded">
                  <ChevronRight className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">Expandable Nodes</p>
                  <p className="text-sm text-gray-400">Click arrows to expand/collapse node children</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-gray-300">
                <div className="p-2 bg-gray-700/50 rounded">
                  <Maximize2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">Node Selection</p>
                  <p className="text-sm text-gray-400">Click nodes to view their content in the canvas</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-900/50 rounded p-3">
              <div className="space-y-2 text-gray-300">
                <div className="flex items-center gap-2">
                  <ChevronDown className="w-4 h-4" />
                  <span>Root</span>
                </div>
                <div className="ml-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4" />
                    <span>Node A</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ChevronDown className="w-4 h-4" />
                    <span>Node B</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700">
          <h2 className="text-lg font-medium mb-4 text-gray-200 flex items-center gap-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2"/>
              <path d="M3 8h18" strokeWidth="2"/>
              <circle cx="6.5" cy="5.5" r="1"/>
            </svg>
            Window System
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-gray-300">
                <div className="p-2 bg-gray-700/50 rounded">
                  <Move className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">Draggable Windows</p>
                  <p className="text-sm text-gray-400">Drag window headers to reposition</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-gray-300">
                <div className="p-2 bg-gray-700/50 rounded">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="3" width="7" height="7" strokeWidth="2"/>
                    <rect x="14" y="3" width="7" height="7" strokeWidth="2"/>
                    <rect x="14" y="14" width="7" height="7" strokeWidth="2"/>
                    <rect x="3" y="14" width="7" height="7" strokeWidth="2"/>
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Multi-Window Support</p>
                  <p className="text-sm text-gray-400">Open multiple windows for comparison</p>
                </div>
              </div>
            </div>
            <div className="relative h-32 bg-gray-900/50 rounded overflow-hidden">
              <div className="absolute top-2 left-2 w-24 h-20 bg-gray-800/90 rounded border border-gray-700 shadow-lg">
                <div className="h-5 bg-gray-700/50 border-b border-gray-600"></div>
              </div>
              <div className="absolute top-4 left-4 w-24 h-20 bg-gray-800/90 rounded border border-gray-700 shadow-lg">
                <div className="h-5 bg-gray-700/50 border-b border-gray-600"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
