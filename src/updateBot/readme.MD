When getting the user status on samsub you can have 4 important statuses. Here it will be explained how are defined

On this status object, it may come a `review` property and inside this a `reviewResult` property.

If `review` is not present, then the user hasn't finished (or even started) the process.

If `review` is present, then we look at `review.reviewResult.reviewAnswer` which will have one of two options: `GREEN` or `RED`.

If this value is `GREEN`, this means the user has passed successfully.

If this value is `RED`, this means there was an issue with the applicant documents. There are two possibilities

If the value is `RED`, we'll look at `review.reviewResult.reviewRejectType`, which may come with two options: `RETRY` or `FINAL`

If this value is `RETRY` then the user can reupload the documents.

But if the value is `FINAL` then it is assumed it hasn't passed and it wasn't merely an error. In this case, it might still be an error, even though it is difficult, but in this case, the process is more manual.