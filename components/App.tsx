import AppController from "@/state/AppController"
import { observer, useLocalObservable } from "mobx-react-lite"
import { useEffect } from "react"
import Form from "components/Form"
import List from "components/List"

export const App = observer(() => {
  const app = useLocalObservable(() => {
    return new AppController()
  })

  useEffect(() => {
    app.init()
  }, [app])

  return (
    <div>
      <div>
        <h2>Create workload</h2>
        <Form onSubmit={app.createWorkload} />
      </div>
      <hr />
      <div>
        <h2>Workloads</h2>
        <List workloads={app.workloads} />
      </div>
    </div>
  )
})

export default App
