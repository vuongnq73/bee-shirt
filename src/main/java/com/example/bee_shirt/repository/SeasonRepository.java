package com.example.bee_shirt.repository;

import com.example.bee_shirt.EntityThuocTinh.Season;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface SeasonRepository extends JpaRepository<Season, Integer> {

    @Query("SELECT s.codeSeason, s.nameSeason, s.statusSeason FROM Season s WHERE s.deleted = false")
    Page<Season> findAllSeasons(Pageable pageable);

    Season findByCodeSeason(String codeSeason);
}
