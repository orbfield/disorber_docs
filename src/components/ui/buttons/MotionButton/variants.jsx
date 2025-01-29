import React from 'react';
import { Play, Pause, Plus, Minus } from 'lucide-react';
import { MotionButton } from './index';

export const PlayButton = (props) => (
  <MotionButton icon={Play} {...props} />
);

export const PauseButton = (props) => (
  <MotionButton icon={Pause} {...props} />
);

export const PlusButton = (props) => (
  <MotionButton icon={Plus} {...props} />
);

export const MinusButton = (props) => (
  <MotionButton icon={Minus} {...props} />
);
