
import Header from '../components/Header';
import LeftSidebar from '../components/LeftSidebar';
import Canvas from '../components/Canvas';
import BottomStatusBar from '../components/BottomStatusBar';
import { ReactFlowProvider } from 'reactflow';
import { useState } from 'react';
import 'reactflow/dist/style.css';

const Index = () => {
  const [viewMode, setViewMode] = useState<'studio' | 'storyboard' | 'editor'>('studio');

  return (
    <ReactFlowProvider>
      <div className="w-screen h-screen bg-zinc-900 flex flex-col">
        <Header viewMode={viewMode} setViewMode={setViewMode} />
        <div className="flex flex-1 h-[calc(100vh-4rem-1.5rem)]">
          <LeftSidebar />
          <Canvas />
        </div>
        <BottomStatusBar />
      </div>
    </ReactFlowProvider>
  );
};

export default Index;
