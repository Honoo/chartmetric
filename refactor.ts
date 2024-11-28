interface GetArtistInsightsQuery {
  artistId: string,
  limit: number,
  weight?: number,
  daysAgo: number,
  isNewsFormat: boolean
}

interface Insight {
  // Insight is a placeholder for the return type of formatInsight()
}

interface News {
  // News is a placeholder for the return type of insightToNews()
}

async function getArtistInsights(query: GetArtistInsightsQuery): Promise<{ newsInsights: News[], weight: number } | Insight[]> {
  const highWeight: number = 8;
  const mediumWeight: number = 4;
  const lowWeight: number = 1;

  let weight: number;
  if (typeof query.weight === 'undefined') {
    const counts = await snowflakeClientExecuteQuery(
      QUERIES.QUERY_GET_ARTIST_INFO.ARTIST_INSIGHTS.GET_INSIGHTS_COUNT(
        query.artistId,
        highWeight,
        mediumWeight,
        query.daysAgo
      )
    );

    const highCounts = counts[0]?.count;
    const mediumCounts = counts[1]?.count;

    if(typeof highCounts !== 'undefined') {
      weight = highWeight;
    } else if (typeof mediumCounts !== 'undefined') {
      weight = mediumWeight;
    } else {
      weight = lowWeight;
    }
  } else {
    weight = query.weight;
  }

  const rawResults = await snowflakeClientExecuteQuery(
    QUERIES.QUERY_GET_ARTIST_INFO.ARTIST_INSIGHTS.GET_ARTIST_INSIGHTS(
      query.artistId,
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
  let insights: Insight[] = await Promise.all(promises);
  insights = insights.filter(e => e != null);
  insights = insights.slice(0, query.limit + ((10 - weight) * 200));

  if (query.isNewsFormat) {
    let promises = [];
    for(const insight of insights) {
      promises.push(insightToNews(insight));
    }
    const newsInsights: News[] = await Promise.all(promises);
    return { newsInsights, weight };
  } else {
    return insights;
  }
}