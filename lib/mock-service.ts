import { addSeconds } from "date-fns"
import type {
  CancelRequest,
  CancelResponse,
  CreateRequest,
  CreateResponse,
  GetAllRequest,
  GetAllResponse,
  Work,
  WorkId,
  WorkStatus,
} from "./types"

interface Workload {
  work: Work
  timer: NodeJS.Timeout | undefined
}

export default class WorkService {
  private workloads: Record<WorkId, Workload> = initialData
  private failCounter = 0

  private sleep = (durationMs = 500) =>
    new Promise((resolve) => setTimeout(resolve, durationMs))

  create = async ({ complexity }: CreateRequest): Promise<CreateResponse> => {
    // sleep to act like a network
    await this.sleep()

    // randomly fail 25% of the time
    if (this.failCounter++ % 4 === 0) throw new Error("Random error!")

    // calculate work duration from complexity
    const seconds = complexity * 1000
    const completeDate = addSeconds(new Date(), complexity)

    // build work object
    const id: WorkId = Object.keys(this.workloads).length + 1
    const status: WorkStatus = "WORKING"
    const work: Work = {
      id,
      complexity,
      status,
      completeDate,
    }

    // do the work
    const timer = setTimeout(() => {
      internalWork.work.status = work.id % 2 ? "FAILURE" : "SUCCESS"
    }, seconds)

    // build internal state
    const internalWork: Workload = {
      work,
      timer,
    }

    this.workloads[id] = internalWork

    return { work }
  }

  getWorkload = async ({ id }: CancelRequest): Promise<CancelResponse> => {
    await this.sleep()
    const workload = this.workloads[id]

    if (!workload) throw new Error("Workload not found")

    return {
      work: workload.work,
    }
  }

  getAllWorkloads = async (params?: GetAllRequest): Promise<GetAllResponse> => {
    return {
      workloads: Object.values(this.workloads).map((workload) => workload.work),
    }
  }

  cancelWorkload = async ({ id }: CancelRequest): Promise<CancelResponse> => {
    await this.sleep()

    const workload = this.workloads[id]
    if (!workload) throw new Error("Workload not found")

    if (workload.work.status !== "WORKING")
      throw new Error("Workload cannot be canceled")

    clearTimeout(workload.timer)
    workload.work.status = "CANCELED"

    return { work: workload.work }
  }
}

const initialData: Record<WorkId, Workload> = {
  0: {
    timer: undefined,
    work: {
      id: 0,
      status: "FAILURE",
      complexity: 1,
      completeDate: new Date(),
    },
  },
  1: {
    timer: undefined,
    work: {
      id: 1,
      status: "SUCCESS",
      complexity: 5,
      completeDate: new Date(),
    },
  },
  2: {
    timer: undefined,
    work: {
      id: 2,
      status: "CANCELED",
      complexity: 3,
      completeDate: new Date(),
    },
  },
  3: {
    timer: undefined,
    work: {
      id: 3,
      status: "WORKING",
      complexity: 7,
      completeDate: addSeconds(new Date(), 7),
    },
  },
}
