import React from 'react'

interface PreferencesProps {
  ball: number
  setColor: (ball: number, color: string) => void
}

const colors = [
  '#FFFFFF',
  '#FF0000',
  '#FFFF00',
  '#0000FF',
  '#FFA500',
  '#FF69B4',
  '#008000',
  '#8B4513',
  '#9400D3',
  '#DC143C',
  '#FF4500',
  '#800080',
  '#00FFFF',
  '#000000',
]

export const Preferences: React.FC<PreferencesProps> = ({ ball, setColor }) => {
  return (
    <div className="top-10 px-6 py-4 gap-3 z-20 flex flex-col bg-white rounded-2xl overflow-hidden absolute">
      <span className="text-zinc-800 text-lg font-bold">Выберите цвет</span>
      <div className="flex">
        {colors.map((color) => (
          <button
            key={color}
            className="w-8 h-8 rounded-md mr-2 cursor-pointer border"
            style={{ backgroundColor: color }}
            onClick={() => setColor(ball, color)}
          />
        ))}
      </div>
    </div>
  )
}
