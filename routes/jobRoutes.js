import { createJob, deleteJob, getAllJobs, updateJob, showStats } from '../controllers/jobsController.js'
import { Router } from 'express'

const router = Router()


router.route('/').get(getAllJobs).post(createJob)
router.route('/:id').delete(deleteJob).patch(updateJob)
router.route('/stats').get(showStats)

export default router


