import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { db, admin } from '../firebase';

export const onPostCreate = onDocumentCreated(
  'communities/{communityId}/posts/{postId}',
  async (event) => {
    const post = event.data?.data();
    if (!post?.deadline) return;

    const communityId = event.params.communityId;

    await db.collection('tasks').add({
      title: post.title,
      communityId,
      dueDate: post.deadline,
      status: 'PENDING',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
);
