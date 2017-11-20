import { Router } from 'express';
import * as CommentController from '../controllers/comment.controller';

const router = new Router();

router.route('post/:cuid/comments').get(CommentController.getComments);
router.route('post/:cuid/comments').post(CommentController.addComment);

router.route('/comments/:cuid').put(CommentController.updateComment);
router.route('/comments/:cuid').delete(CommentController.deleteComment);

export default router;
