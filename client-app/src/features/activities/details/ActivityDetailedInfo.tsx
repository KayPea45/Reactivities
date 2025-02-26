import { observer } from 'mobx-react-lite';
import {Activity} from "../../../app/models/activity";

interface Props {
    activity: Activity
}

export default observer(function ActivityDetailedInfo({activity}: Props) {
    return (
        <>
        {activity}
        </>
    )
})

