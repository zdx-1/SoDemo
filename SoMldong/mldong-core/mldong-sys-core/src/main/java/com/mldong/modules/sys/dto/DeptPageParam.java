package com.mldong.modules.sys.dto;

import com.mldong.base.PageParam;
import com.mldong.modules.sys.entity.Dept;
import io.swagger.annotations.ApiModel;
import lombok.Data;

@ApiModel
@Data
// ==
public class DeptPageParam extends PageParam<Dept> {
}