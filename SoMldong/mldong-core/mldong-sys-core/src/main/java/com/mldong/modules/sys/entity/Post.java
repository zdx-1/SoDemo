package com.mldong.modules.sys.entity;
import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import java.util.Date;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

/**
 * <p>
 * 岗位
 * </p>
 *
 * @author mldong
 * @since 2023-09-21
 */
@Getter
@Setter
@TableName("sys_post")
@ApiModel(value = "Post对象", description = "岗位")
public class Post implements Serializable  {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty("岗位ID")
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;

    @ApiModelProperty("岗位名称")
    private String name;

    @ApiModelProperty("唯一编码")
    private String code;

    @ApiModelProperty("排序")
    private Long sort;

    @ApiModelProperty("是否启用")
    private Integer enabled;

    @ApiModelProperty("备注")
    private String remark;

    @ApiModelProperty("创建时间")
    @TableField(fill = FieldFill.INSERT)
    private Date createTime;

    @ApiModelProperty("创建用户")
    @TableField(fill = FieldFill.INSERT)
    private Long createUser;

    @ApiModelProperty("更新时间")
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Date updateTime;

    @ApiModelProperty("更新用户")
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Long updateUser;

    @ApiModelProperty("是否删除")
    @TableField(fill = FieldFill.INSERT)
    @TableLogic
    private Integer isDeleted;

}
