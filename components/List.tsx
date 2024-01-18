import type { Work } from "@/lib/types"
import { observer } from "mobx-react-lite"
import Item from "components/Item"

interface ListProps {
  workloads: Work[]
}

export const List = observer<ListProps>(({ workloads }) => {
  return (
    <ul>
      {workloads.map((work) => (
        <li key={work.id}>
          <Item
            work={work}
            onCancel={async (work) => {
              console.log("Cancel workload", { work })
            }}
          />
        </li>
      ))}
    </ul>
  )
})

export default List
