import { observer } from "mobx-react-lite";
// import { SyntheticEvent } from "react";

// const activityImageStyle = {
// 	filter: "brightness(30%)",
// };

// const activityImageTextStyle = {
// 	position: "absolute",
// 	bottom: "0%",
// 	left: "0%",
// 	width: "100%",
// 	height: "auto",
// 	color: "white",
// };

interface Props {
	activity: Activity;
}

export default observer(function ActivityDetailedHeader({ activity }: Props) {
	// const categoryImage = `/assets/categoryImages/${activity.category}.jpg`;
	return (
		<>
		{activity}
		</>
	);
});
