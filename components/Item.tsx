import type { Work } from "@/lib/types"
import { observer } from "mobx-react-lite"
import { format } from "date-fns"

interface   ItemProps {
  work: Work
  onCancel: (work: Work) => Promise<unknown>
}

export const Item = observer<  ItemProps>(
  ({ work, onCancel }) => {
    return (
      <div>
        <h3>Workload #{work.id}</h3>
        <div>Complexity: {work.complexity}</div>

        <div>Status: {work.status}</div>

        {work.status === "WORKING" && (
          <>
            <div>Complete date: {format(work.completeDate, "PPPPpppp")}</div>
            <button onClick={() => onCancel(work)}>Cancel</button>
          </>
        )}
      </div>
    )
  }
)

export default Item
