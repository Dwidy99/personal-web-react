// utils/RandomColors.js
export default function RandomColors() {
  const colors = [
    "bg-meta-1",
    "bg-meta-2",
    "bg-meta-3",
    "bg-meta-4",
    "bg-meta-5",
    "bg-meta-6",
    "bg-meta-7",
    "bg-meta-8",
    "bg-meta-9",
    "bg-meta-10",
  ];

  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  return randomColor;
}
