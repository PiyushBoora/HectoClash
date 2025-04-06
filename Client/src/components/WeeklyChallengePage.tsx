// pages/WeeklyChallengePage.tsx
import GameScreen from "./GameScreen";
import { useLocation } from "react-router-dom";
const WeeklyChallengePage = () => {
  const location = useLocation();
  const { sequence, challengeType, challengeId } = location.state || {};
  return <GameScreen mode="weekly"  sequence={sequence}  challengeId={challengeId}/>;
};

export default WeeklyChallengePage;
