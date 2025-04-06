// pages/DailyChallengePage.tsx
import GameScreen from "./GameScreen";
import { useLocation } from "react-router-dom";

const DailyChallengePage = () => {
  const location = useLocation();
  const { sequence, challengeType, challengeId } = location.state || {};

  // useEffect(() => {
  //   console.log("Challenge data from navigate:", {
  //     sequence,
  //     challengeType,
  //     challengeId
  //   });
  // }, []);
  
  return <GameScreen mode="daily" sequence={sequence}  challengeId={challengeId}/>;
};

export default DailyChallengePage;
