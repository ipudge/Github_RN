import {onThemeChange} from './themes'
import {onRefreshPopular, onLoadMorePopular, onFlushPopularFavorite} from './popular'
import {onRefreshTrending, onLoadMoreTrending, onFlushTrendingFavorite} from './trending'
import {onLoadLanguage} from './language'
import {onLoadFavoriteData} from './favorite'

export default {
  onThemeChange,
  onRefreshPopular,
  onLoadMorePopular,
  onFlushPopularFavorite,
  onRefreshTrending,
  onLoadMoreTrending,
  onLoadFavoriteData,
  onLoadLanguage,
  onFlushTrendingFavorite
}
