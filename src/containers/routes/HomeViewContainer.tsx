import { View } from "../../components/View";
import { Button } from "../../components/Button";

export const HomeViewContainer = () => {
  return (
    <View>
      <div className="space-y-2 sm:space-x-2 sm:space-y-0">
        <Button type="info" />
        <Button type="warning" />
        <Button type="error" />
        <Button type="success" />
      </div>
    </View>
  );
};
