import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Info, ArrowUpRight, ArrowDownRight, Settings, Zap } from 'lucide-react';

const ActionButtons = () => {
  const buttons = [
    { Icon: Play, title: 'Play' },
    { Icon: Pause, title: 'Pause' },
    { Icon: Info, title: 'Info' },
    { Icon: ArrowUpRight, title: 'Up' },
    { Icon: ArrowDownRight, title: 'Down' },
    { Icon: Settings, title: 'Settings' },
    { Icon: Zap, title: 'Actions' }
  ];

  return (
    <div className="flex gap-1 mb-4 flex-wrap">
      {buttons.map(({ Icon, title }, index) => (
        <motion.button
          key={index}
          className="p-1.5 hover:bg-gray-800/30 rounded-xl text-white"
          title={title}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Icon size={16} />
        </motion.button>
      ))}
    </div>
  );
};

export default ActionButtons;