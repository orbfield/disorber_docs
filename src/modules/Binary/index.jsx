import { BinaryProvider } from './core/BinaryContext';
import BinaryPage1 from './ui/BinaryPage1';

const BinaryModule = () => {
  return (
    <BinaryProvider>
      <BinaryPage1 />
    </BinaryProvider>
  );
};

export default BinaryModule;
