import GroovyAnimated from "@/components/illustrations/GroovyAnimated";
import AnimatedCircle from "@/components/illustrations/AnimatedCircle";
import AnimatedTriangle from "@/components/illustrations/AnimatedTriangle";

export default function Loading() {
  return (
    <div className='relative flex items-center justify-center min-h-screen bg-zinc-100 dark:bg-zinc-900 overflow-hidden'>
      {/* Circle — top left */}
      <AnimatedCircle
        size={70}
        strokeWidth={1.5}
        className='absolute'
        style={
          {
            top: "8%",
            left: "6%",
            "--shape-duration": "4s",
            "--shape-delay": "0s",
          } as React.CSSProperties
        }
      />

      {/* Circle — bottom right */}
      <AnimatedCircle
        size={60}
        strokeWidth={1.5}
        className='absolute'
        style={
          {
            bottom: "10%",
            right: "8%",
            "--shape-duration": "3.6s",
            "--shape-delay": "1.8s",
          } as React.CSSProperties
        }
      />

      {/* Triangle — top right, slight tilt */}
      <AnimatedTriangle
        size={50}
        strokeWidth={1.5}
        rotation={15}
        className='absolute'
        style={
          {
            top: "7%",
            right: "10%",
            "--shape-duration": "5s",
            "--shape-delay": "0.7s",
          } as React.CSSProperties
        }
      />

      {/* Triangle — bottom left, counter-tilt */}
      <AnimatedTriangle
        size={50}
        strokeWidth={1.5}
        rotation={-20}
        className='absolute'
        style={
          {
            bottom: "9%",
            left: "8%",
            "--shape-duration": "4.4s",
            "--shape-delay": "2.2s",
          } as React.CSSProperties
        }
      />

      {/* Triangle — mid right, inverted */}
      <AnimatedTriangle
        size={60}
        strokeWidth={1.5}
        rotation={180}
        className='absolute'
        style={
          {
            top: "42%",
            right: "5%",
            "--shape-duration": "3.8s",
            "--shape-delay": "1.1s",
          } as React.CSSProperties
        }
      />

      {/* Centre illustration */}
      <GroovyAnimated />
    </div>
  );
}
