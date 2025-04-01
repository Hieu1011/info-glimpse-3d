
import SolarSystem from './solar-system';

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 bg-black">
      <SolarSystem />
    </div>
  );
};

export default AnimatedBackground;
