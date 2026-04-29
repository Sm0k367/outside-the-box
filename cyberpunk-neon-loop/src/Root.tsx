import "./index.css";
import { Composition } from "remotion";
import { CyberpunkLoop } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="CyberpunkNeonLoop"
        component={CyberpunkLoop}
        durationInFrames={450} // 15 seconds @ 30fps - exact match to request
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: "AVATAR vs ENFORCER - NEON LOOP",
        }}
      />
    </>
  );
};
