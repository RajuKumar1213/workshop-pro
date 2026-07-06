'use client';

import { Stage, Layer, Rect, Transformer } from 'react-konva';
import { useRef, useEffect } from 'react';
import { useCanvasState, CanvasObject } from '../hooks/use-canvas-state';
import { Toolbar } from './toolbar';
import { PropertiesPanel } from './properties-panel';
import { v4 as uuidv4 } from 'uuid';

export function MeasurementCanvas() {
  const { objects, selectedId, setSelectedId, addObject, updateObject, deleteObject } = useCanvasState();
  const trRef = useRef<any>(null);
  const stageRef = useRef<any>(null);

  // Handle deselecting when clicking on empty area
  const checkDeselect = (e: any) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedId(null);
    }
  };

  useEffect(() => {
    if (selectedId && trRef.current) {
      const node = stageRef.current.findOne('#' + selectedId);
      if (node) {
        trRef.current.nodes([node]);
        trRef.current.getLayer().batchDraw();
      }
    }
  }, [selectedId, objects]);

  const handleAddRect = () => {
    addObject({
      id: uuidv4(),
      type: 'rect',
      x: 50,
      y: 50,
      width: 100,
      height: 100,
      fill: '#a0aec0',
    });
  };

  const selectedObj = objects.find(o => o.id === selectedId);

  return (
    <div className="flex flex-col h-[600px] border rounded-lg overflow-hidden bg-white shadow-sm">
      <Toolbar onAddRect={handleAddRect} onAddText={() => alert('Text tool not implemented in this demo')} />
      
      <div className="flex flex-1">
        <div className="flex-1 bg-slate-50 overflow-hidden relative">
          <Stage
            width={800} // In real app, this would be responsive
            height={600}
            onMouseDown={checkDeselect}
            onTouchStart={checkDeselect}
            ref={stageRef}
          >
            <Layer>
              {objects.map((obj) => (
                <Rect
                  key={obj.id}
                  id={obj.id}
                  x={obj.x}
                  y={obj.y}
                  width={obj.width}
                  height={obj.height}
                  fill={obj.fill}
                  draggable
                  onClick={() => setSelectedId(obj.id)}
                  onTap={() => setSelectedId(obj.id)}
                  onDragEnd={(e) => {
                    updateObject(obj.id, {
                      x: e.target.x(),
                      y: e.target.y(),
                    });
                  }}
                  onTransformEnd={(e) => {
                    const node = e.target;
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();

                    node.scaleX(1);
                    node.scaleY(1);

                    updateObject(obj.id, {
                      x: node.x(),
                      y: node.y(),
                      width: Math.max(5, node.width() * scaleX),
                      height: Math.max(5, node.height() * scaleY),
                    });
                  }}
                />
              ))}
              {selectedId && (
                <Transformer
                  ref={trRef}
                  boundBoxFunc={(oldBox, newBox) => {
                    // limit resize
                    if (newBox.width < 5 || newBox.height < 5) {
                      return oldBox;
                    }
                    return newBox;
                  }}
                />
              )}
            </Layer>
          </Stage>
        </div>

        <PropertiesPanel 
          selectedObj={selectedObj} 
          onUpdate={(attrs) => {
            if (selectedId) updateObject(selectedId, attrs);
          }} 
        />
      </div>
    </div>
  );
}
