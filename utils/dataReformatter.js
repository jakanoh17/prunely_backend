const formatDate = (dateString) =>
  new Date(dateString).toISOString().split("T")[0];

const reformatDataForFreqUsedLabels = (sessions) => {
  // Initialize the result object
  const reformattedData = {};

  // Iterate through the data
  sessions.forEach((session) => {
    const day = formatDate(session.createdAt);
    const intervals = session.intervals.toObject();

    intervals.forEach((interval) => {
      interval.labels.forEach((label) => {
        // Initialize the label in the result if it doesn't exist
        if (!reformattedData[label]) {
          reformattedData[label] = [];
        }

        // Find or create the day entry for the label
        let dayEntry = reformattedData[label].find(
          (entry) => entry.day === day
        );
        if (!dayEntry) {
          dayEntry = { day, totalElapsedTime: 0, count: 0 };
          reformattedData[label].push(dayEntry);
        }

        // Update the day entry with the elapsed time and increment the count
        dayEntry.totalElapsedTime += interval.elapsedTime;
        dayEntry.count += 1;
      });
    });
  });

  // Calculate the average elapsed time for each label on each day
  Object.keys(reformattedData).forEach((label) => {
    reformattedData[label] = reformattedData[label].map(
      ({ day, totalElapsedTime, count }) => ({
        day,
        avgElapsedTime: (totalElapsedTime / count).toFixed(2),
      })
    );
  });

  return reformattedData;
};

module.exports = { reformatDataForFreqUsedLabels };
