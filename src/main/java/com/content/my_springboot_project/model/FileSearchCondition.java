package com.content.my_springboot_project.model;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class FileSearchCondition {
    private String searchTerm;
    private String resourceType;
    private String dateRange;
    private String order;

    private LocalDateTime startDate;

    public void setDateRange() {
        if (dateRange != null) {
            switch (dateRange) {
                case "last24Hours":
                startDate = LocalDateTime.now().minusDays(1);
                    break;

                case "last7Days":
                startDate = LocalDateTime.now().minusDays(7);
                    break;

                case "last30Days":
                startDate = LocalDateTime.now().minusDays(30);
                    break;

                case "last90Days":
                startDate = LocalDateTime.now().minusDays(90);
                    break;
                default:
                    break;
            }
        }
    }
}
