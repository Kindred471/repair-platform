package com.repair.server.dto;

import lombok.Data;

@Data
public class CancellationResponseRequest {
    private Boolean agree; // true=同意撤销, false=拒绝撤销
}
