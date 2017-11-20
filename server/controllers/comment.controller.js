import Comment from '../models/comment';
import Post from '../models/post';
import cuid from 'cuid';
import sanitizeHtml from 'sanitize-html';


export function getComments(req, res) {
  Post.findOne({ cuid: req.params.cuid }).exec((err, post) => {
    if (err) {
      return res.status(500).send(err);
    }

    if (!post) {
      return res.status(400).end();
    }

    Comment.find({ owner: post._id }).exec((commentErr, comments) => {
      if (commentErr) {
        return res.status(500).send(commentErr);
      }
      return res.json({ comments });
    });
    return true;
  });
}

export function addComment(req, res) {
  if (!req.body.comment || !req.body.comment.author || !req.body.comment.body) {
    return res.status(403).end();
  }

  Post.findOne({ cuid: req.params.cuid }).exec((err, post) => {
    if (err) {
      return res.status(500).send(err);
    }

    if (!post) {
      return res.status(400).end();
    }

    const newComment = new Comment(req.body.comment);

    newComment.author = sanitizeHtml(newComment.author);
    newComment.body = sanitizeHtml(newComment.body);
    newComment.cuid = cuid();
    newComment.owner = post;
    newComment.save((error, saved) => {
      if (error) {
        return res.status(500).send(error);
      }
      return res.json({ comment: saved });
    });
    return true;
  });
  return true;
}

export function deleteComment(req, res) {
  Comment.findOne({ cuid: req.params.cuid }).exec((err, comment) => {
    if (err) {
      return res.status(500).send(err);
    }

    if (!comment) {
      return res.status(400).end();
    }

    comment.remove(() => {
      return res.status(200).end();
    });
    return true;
  });
}

export function updateComment(req, res) {
  if (!req.body.comment || !req.body.comment.body) {
    return res.status(403).end();
  }
  Comment.findOne({ cuid: req.params.cuid }).exec((err, comment) => {
    if (err) {
      return res.status(500).send(err);
    }

    if (!comment) {
      return res.status(400).end();
    }
    /* eslint-disable */
    comment.body = sanitizeHtml(req.body.comment.body);
    /* eslint-enable */
    comment.save((saveErr, saved) => {
      if (saveErr) {
        return res.status(500).send(saveErr);
      }

      res.json({ comment: saved });
      return true;
    });
    return true;
  });
  return true;
}
