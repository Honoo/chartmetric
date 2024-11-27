interface GetArtistInsightsQuery {
  artist_id: string,
  limit: number,
  weight?: number,
  daysAgo: number,
  isNewsFormat: boolean
}

async function getArtistInsights(query: GetArtistInsightsQuery) {
  const high_weight: number = 8;
  const medium_weight: number = 4;
  const low_weight: number = 1;

  let weight: number;
  if (typeof query.weight === 'undefined') {
    const counts = await snowflakeClientExecuteQuery(
      QUERIES.QUERY_GET_ARTIST_INFO.ARTIST_INSIGHTS.GET_INSIGHTS_COUNT(
        query.artist_id,
        high_weight,
        medium_weight,
        query.daysAgo
      )
    );

    const high = counts[0]?.count;
    const medium = counts[1]?.count;

    if(typeof high !== 'undefined') {
      weight = high_weight;
    } else if (typeof medium !== 'undefined') {
      weight = medium_weight;
    } else {
      weight = low_weight;
    }
  } else {
    weight = query.weight;
  }

  const rawResults = await snowflakeClientExecuteQuery(
    QUERIES.QUERY_GET_ARTIST_INFO.ARTIST_INSIGHTS.GET_ARTIST_INSIGHTS(
      query.artist_id,
      query.limit * 10,
      weight,
      query.daysAgo
    )
  );

  const filteredResults: [] = await filterResults(rawResults);

  let promises = [];
  for (const result of filteredResults) {
    promises.push(formatInsight(result));
  }
  let results = await Promise.all(promises);
  results = results.filter(e => e != null);
  results = results.slice(0, query.limit + (10 - weight) * 200);

  if (query.isNewsFormat) {
    let promises = [];
    for(const result of results) {
      promises.push(insightToNews(result));
    }
    const insights = await Promise.all(promises);
    return { insights, weight };
  } else {
    return results;
  }
}