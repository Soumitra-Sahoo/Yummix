import React, { useState } from 'react'
import Header from '../../components/Header/Header'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'
import AppDownload from '../../components/AppDownload/AppDownload'

const Home = ({searchQuery}) => {

  const [category,setCategory] = useState("All");
  const isSearching = searchQuery && searchQuery.trim() !== "";

    return (
    <>
      {!isSearching && <Header />}
      {!isSearching && (
        <ExploreMenu setCategory={setCategory} category={category} />
      )}

      <FoodDisplay category={category} searchQuery={searchQuery} />

      {!isSearching && <AppDownload />}
    </>
  )
}

export default Home
